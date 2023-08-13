import AppStateContext from "@services/context/context"
import AssociationPage from "@services/models/associations/associationPages"
import { useAppDispatch } from "@services/store"
import { associationSelector } from "@services/store/slices/associations"
import { fetchAssociationPages } from "@services/store/slices/associations/associationsPages"
import { changeBottomSheetFormPosition } from "@services/store/slices/bottomSheetForm"
import { copyData } from "@services/utils/storage"
import { associationPageValidationSchema } from "@services/validations/yup/association.validation"
import { Formik } from "formik"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import {
  Button,
  IconButton,
  RadioButton,
  Text,
  TextInput,
  useTheme
} from "react-native-paper"
import Icon from "react-native-paper/src/components/Icon"
import SelectDropdown from "react-native-select-dropdown"

const CreateAssociationPage: FC = () => {
  const [selectedAssociationPage, setSelectedAssociationPage] = useState<
    IAssociation[]
  >([])

  const { colors } = useTheme()
  const dispatch = useAppDispatch()
  const { locale, setLoading, setActionModalProps } =
    useContext(AppStateContext)
  const associations = associationSelector.getAssociations()

  const updateFields = (associationId: string, setFieldValue: any) => {
    const selectedAssociation = associations.data.createdAssociation.find(
      association => association.id === associationId
    )
    setFieldValue("associationId", associationId)

    if (selectedAssociation) {
      setFieldValue("pageName", selectedAssociation.name, true)
      setFieldValue("customUrl", selectedAssociation.acronym, true)
      setFieldValue("username", selectedAssociation.acronym, true)
    }
  }

  const submitAssociationPage = useCallback(
    (values: INewAssociationPage, { resetForm }: { resetForm: () => void }) => {
      setLoading(true)

      AssociationPage.createAssociationPages(values)
        .then(() => {
          setActionModalProps({
            icon: true,
            state: "success",
            shouldDisplay: true,
            title: locale.t("pages.associationPageCreated")
          })

          resetForm()
          dispatch(changeBottomSheetFormPosition(-1))
          dispatch(fetchAssociationPages())
        })
        .catch(() => {
          setActionModalProps({
            icon: true,
            state: "error",
            shouldDisplay: true,
            title: locale.t("commonErrors.title"),
            description: locale.t("commonErrors.description")
          })
        })
        .finally(() => setLoading(false))
    },
    [dispatch, locale, setActionModalProps, setLoading]
  )

  useEffect(() => {
    setSelectedAssociationPage(associations.data.createdAssociation)
  }, [associations.data.createdAssociation])

  return (
    <View style={styles.screen}>
      <View style={styles.titleContainer}>
        <View style={styles.title}>
          <Text variant="titleLarge">
            {locale.t(`pages.newAssociationPage`)}
          </Text>
        </View>
        <View style={styles.titleIcon}>
          <Icon
            source="badge-account-horizontal-outline"
            size={32}
            color={colors.secondary}
          />
        </View>
      </View>
      <Formik
        initialValues={{
          associationId: "",
          pageName: "",
          customUrl: "",
          description: "",
          username: "",
          isPublic: true,
          visible: true
        }}
        validationSchema={associationPageValidationSchema}
        onSubmit={submitAssociationPage}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched
        }) => (
          <View style={{ rowGap: 24 }}>
            <View style={styles.fieldsContainer}>
              <View style={styles.field}>
                <View style={styles.screen}>
                  <SelectDropdown
                    data={selectedAssociationPage}
                    defaultButtonText={locale.t("pages.selectAssociation")}
                    buttonStyle={{
                      ...styles.uniqueDropdown,
                      borderBottomColor: errors.associationId
                        ? colors.error
                        : "rgba(0,0,0,0.2)"
                    }}
                    buttonTextStyle={{
                      ...styles.dropdownTextStyles,
                      color: errors.associationId ? colors.error : undefined
                    }}
                    rowTextStyle={styles.dropdownTextStyles}
                    dropdownStyle={{ borderRadius: 12 }}
                    onSelect={item => updateFields(item.id, setFieldValue)}
                    search
                    searchInputTxtStyle={{ fontFamily: "Sora" }}
                    buttonTextAfterSelection={selectedItem => selectedItem.name}
                    rowTextForSelection={item => item.name}
                    onChangeSearchInputText={text =>
                      setSelectedAssociationPage(
                        associations.data.createdAssociation.filter(page =>
                          page.name.includes(text)
                        )
                      )
                    }
                  />
                  {errors.associationId && touched.associationId && (
                    <View>
                      <Text
                        style={{
                          color: colors.error
                        }}
                      >
                        {locale.t(errors.associationId)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.field}>
                <View style={styles.screen}>
                  <View>
                    <TextInput
                      label={locale.t("pages.pageName")}
                      placeholder={locale.t("pages.pageName")}
                      placeholderTextColor="rgba(0, 0, 0, 0.20)"
                      value={values.pageName}
                      onBlur={handleBlur("pageName")}
                      onChangeText={handleChange("pageName")}
                      style={styles.textInput}
                      dense
                      underlineColor="rgba(0,0,0,0.5)"
                      error={!!errors.pageName && !!touched.pageName}
                    />
                    {errors.pageName && touched.pageName && (
                      <View>
                        <Text
                          style={{
                            color: colors.error
                          }}
                        >
                          {locale.t(errors.pageName)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.field}>
                <View style={styles.screen}>
                  {values.customUrl ? (
                    <View
                      style={[
                        styles.urlContainer,
                        { backgroundColor: `${colors.primary}34` }
                      ]}
                    >
                      <View style={{ flex: 3 }}>
                        <Text
                          variant="bodySmall"
                          style={{ fontFamily: "SoraBold" }}
                        >
                          {locale.t("pages.customUrlPreview")}
                        </Text>
                        <Text>
                          {`https://test.djangii.com/#/page/${values.customUrl}`.toLocaleLowerCase()}
                        </Text>
                      </View>
                      <View>
                        <IconButton
                          size={24}
                          icon="content-copy"
                          onPress={() =>
                            copyData(
                              `https://test.djangii.com/#/page/${values.customUrl}`.toLocaleLowerCase(),
                              locale
                            )
                          }
                        />
                      </View>
                    </View>
                  ) : null}
                  <View>
                    <TextInput
                      label={locale.t("pages.customUrl")}
                      placeholder={locale.t("pages.customUrl")}
                      placeholderTextColor="rgba(0, 0, 0, 0.20)"
                      value={values.customUrl}
                      onBlur={handleBlur("customUrl")}
                      onChangeText={handleChange("customUrl")}
                      style={styles.textInput}
                      dense
                      underlineColor="rgba(0,0,0,0.5)"
                      error={!!errors.customUrl && !!touched.customUrl}
                    />
                    {errors.customUrl && touched.customUrl && (
                      <View>
                        <Text
                          style={{
                            color: colors.error
                          }}
                        >
                          {locale.t(errors.customUrl)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.field}>
                <View style={styles.screen}>
                  <View>
                    <TextInput
                      label={locale.t("pages.aboutUs")}
                      placeholder={locale.t("pages.aboutUs")}
                      placeholderTextColor="rgba(0, 0, 0, 0.20)"
                      value={values.description}
                      onBlur={handleBlur("description")}
                      onChangeText={handleChange("description")}
                      style={styles.textInput}
                      multiline
                      underlineColor="rgba(0,0,0,0.5)"
                      error={!!errors.description && !!touched.description}
                    />
                    {errors.description && touched.description && (
                      <View>
                        <Text
                          style={{
                            color: colors.error
                          }}
                        >
                          {locale.t(errors.description)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: `${colors.primary}34`,
                  padding: 8,
                  borderRadius: 8
                }}
              >
                <Text variant="labelMedium">
                  {locale.t("pages.choosePrivacy")}
                </Text>
              </View>

              <View style={{ rowGap: 12 }}>
                <TouchableOpacity
                  onPress={() => setFieldValue("isPublic", true)}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={styles.checkboxTitleContainer}>
                      <View style={styles.checkboxTitle}>
                        <Icon size={24} source="earth" color={colors.primary} />
                        <Text variant="labelMedium">
                          {locale.t("pages.publicProfile")}
                        </Text>
                      </View>
                      <Text>{locale.t("pages.publicProfileDescription")}</Text>
                    </View>
                    <RadioButton
                      value="true"
                      status={values.isPublic ? "checked" : "unchecked"}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFieldValue("isPublic", false)}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={styles.checkboxTitleContainer}>
                      <View style={styles.checkboxTitle}>
                        <Icon
                          size={24}
                          source="lock-outline"
                          color={colors.primary}
                        />
                        <Text variant="labelMedium">
                          {locale.t("pages.privateProfile")}
                        </Text>
                      </View>
                      <Text>{locale.t("pages.privateProfileDescription")}</Text>
                    </View>
                    <RadioButton
                      value="false"
                      status={!values.isPublic ? "checked" : "unchecked"}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: `${colors.primary}34`,
                  padding: 8,
                  borderRadius: 8
                }}
              >
                <Text variant="labelMedium">
                  {locale.t("pages.chooseVisibility")}
                </Text>
              </View>

              <View style={{ rowGap: 12 }}>
                <TouchableOpacity
                  onPress={() => setFieldValue("visible", true)}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={styles.checkboxTitleContainer}>
                      <View style={styles.checkboxTitle}>
                        <Icon
                          size={24}
                          source="eye-outline"
                          color={colors.primary}
                        />
                        <Text variant="labelMedium">
                          {locale.t("common.visible")}
                        </Text>
                      </View>
                      <Text>{locale.t("pages.publicProfileDescription")}</Text>
                    </View>
                    <RadioButton
                      value="true"
                      status={values.visible ? "checked" : "unchecked"}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFieldValue("visible", false)}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={styles.checkboxTitleContainer}>
                      <View style={styles.checkboxTitle}>
                        <Icon
                          size={24}
                          source="eye-off-outline"
                          color={colors.primary}
                        />
                        <Text variant="labelMedium">
                          {locale.t("common.mask")}
                        </Text>
                      </View>
                      <Text>{locale.t("pages.privateProfileDescription")}</Text>
                    </View>
                    <RadioButton
                      value="false"
                      status={!values.visible ? "checked" : "unchecked"}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Button
                mode="contained"
                textColor={colors.surface}
                onPress={() => {
                  handleSubmit()
                }}
              >
                {locale.t("pages.createAssociationPage")}
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    flex: 4,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  titleIcon: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  fieldsContainer: {
    flex: 1,
    rowGap: 12
  },
  field: {
    flexDirection: "row",
    columnGap: 12
  },
  textInput: {
    paddingHorizontal: 0
  },
  uniqueDropdown: {
    height: 48,
    width: "100%",
    backgroundColor: "#fff",
    borderBottomWidth: 1
  },
  dropdownTextStyles: {
    fontFamily: "Sora",
    fontSize: 16
  },
  urlContainer: {
    padding: 8,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  checkboxTitleContainer: {
    rowGap: 8,
    width: "80%"
  },
  checkboxTitle: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8
  }
})

export default CreateAssociationPage
