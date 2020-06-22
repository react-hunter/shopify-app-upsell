import React from "react";
import { Card, Label } from "@shopify/polaris";
import { Field } from "redux-form";
import { required } from 'redux-form-validators';
import { I18n } from "react-redux-i18n";
import QuestionMark from "../../components/QuestionMark";
import ColorPickerInput from "../../components/Fields/ColorPickerInput";
import CheckboxInput from "../../components/Fields/CheckboxInput";
import TextInput from "../../components/Fields/TextInput";
import FontInput from "../../components/Fields/FontInput";
import SelectInput from "../../components/Fields/SelectInput";

const Product = ({ show_description, show_quantity, changePageShow }) => (
  <Card title={I18n.t("Product")} sectioned>
    <QuestionMark
      className="Question-cart-header"
      content={I18n.t(
        "Show the most important product information to decrease visual overload"
      )}
    />
    <div
      style={{
        display: "flex",
        marginBottom: "0.4rem",
        justifyContent: "space-between"
      }}
    >
      <Label>{I18n.t("Image layout")}</Label>
    </div>

    <Field
      name="design.theme.product.image_layout"
      component={SelectInput}
      eventName="click-design_product_image_layout"
      className="margin-bottom"
      options={[
        { label: I18n.t("Square"), value: "square" },
        { label: I18n.t("Horizontal"), value: "horizontal" },
        {
          label: I18n.t("Vertical"),
          value: "vertical"
        }
      ]}
    />
    <Field
      className="margin-bottom"
      name="design.theme.product.text_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t("Text color")}
      eventName="click-design_product_text_color"
    />
    <div
      className="margin-bottom"
      style={{ display: "flex", alignItems: "center" }}
    >
      <div style={{ marginRight: "3rem" }}>
        <Label>{I18n.t("Font")}</Label>
      </div>
      <div style={{ display: "flex", flex: "auto" }}>
        <Field
          name="design.theme.product.font"
          label={I18n.t("Font")}
          component={FontInput}
          eventName="click-design_product_font"
        />
      </div>
    </div>
    <Field
      className="margin-bottom"
      name="design.theme.product.show_quantity"
      component={CheckboxInput}
      fullWidth
      label={I18n.t("Show quantity")}
      eventName="click-design_product_show_quantity"
    />
    {show_quantity && (
      <Field
        name="design.theme.product.quantity_text"
        className="margin-bottom"
        component={TextInput}
        label={I18n.t("Quantity text")}
        eventName="click-design_product_quantity_text"
      />
    )}
    <Field
      className="margin-bottom"
      name="design.theme.product.vartiants_bg_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t("Variants bg color")}
      eventName="click-design_product_variants_bg_color"
    />

    <Field
      className="margin-bottom"
      name="design.theme.product.variants_text_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t("Variants text color")}
      eventName="click-design_product_variants_text_color"
    />

    <div style={{ position: 'relative' }} className="margin-bottom">
      <QuestionMark
        className="Question-cart-header"
        style={{ top: 0, right: 0 }}
        content={I18n.t(
          "This text will show if the selected variant is out of stock"
        )}
      />
      <Field
        name="design.theme.product.out_of_stock_text"
        className="margin-bottom gray-color-lable"
        component={TextInput}
        handleFocus={() => {
          changePageShow('out_of_stock_text');
        }}
        handleBlur={() => {
          changePageShow('out_of_stock_text');
        }}
        label={I18n.t("Out of stock text")}
        eventName="click-design_out_of_stock_text"
        spellCheck
      />
    </div>
    <div style={{position: 'relative'}} className="margin-bottom">
      <Label>{I18n.t('Main button text')}</Label>
      <QuestionMark
        className="Question-cart-header"
        style={{ top: 0, right: 0 }}
        content={I18n.t(
          "These texts would show based on your campaign type"
        )}
      />
    </div>

    <Field
      name="design.theme.product.cart_page_button_text"
      className="margin-bottom gray-color-lable"
      component={TextInput}
      handleFocus={() => {
        changePageShow('cart_page')
      }}
      handleBlur={() => {
        changePageShow('cart_page')
      }}
      label={I18n.t("Cart page text")}
      eventName="click-design_product_button_text"
      spellCheck
    />

    <Field
      name="design.theme.product.thank_you_page_button_text"
      className="margin-bottom gray-color-lable"
      component={TextInput}
      handleFocus={() => {
        changePageShow('thankyou_page')
      }}
      handleBlur={() => {
        changePageShow('cart_page')
      }}
      label={I18n.t("Thank you page text")}
      eventName="click-design_product_button_text"
      spellCheck
      validate={[required()]}
    />

    <Field
      className="margin-bottom"
      name="design.theme.product.button_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t("Button color")}
      eventName="click-design_product_button_color"
      validate={[required()]}
    />

    <Field
      className="margin-bottom"
      name="design.theme.product.button_text_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t("Button text color")}
      eventName="click-design_product_button_text_color"
    />

    <div style={{position: 'relative'}} className="margin-bottom">
      <Label>{I18n.t('Secondary button text')}</Label>
      <QuestionMark
        className="Question-cart-header"
        style={{ top: 0, right: 0 }}
        content={I18n.t(
          "These texts would show based on your campaign type"
        )}
      />
    </div>
    {/* <Field
      name="design.theme.product.product_page_text"
      className="margin-bottom gray-color-lable"
      component={TextInput}
      label={I18n.t("Product page text")}
      eventName="click-design_product_button_text"
      spellCheck
      handleFocus={() => {
        changePageShow('product_page')
      }}
      handleBlur={() => {
        changePageShow('product_page')
      }}
    />  */}
    <Field
      name="design.theme.product.cart_page_text"
      className="margin-bottom gray-color-lable"
      component={TextInput}
      handleFocus={() => {
        changePageShow('cart_page')
      }}
      handleBlur={() => {
        changePageShow('cart_page')
      }}
      label={I18n.t("Cart page text")}
      eventName="click-design_product_button_text"
      spellCheck
      validate={[required()]}
    /> 
    <Field
      name="design.theme.product.thank_you_page_text"
      className="margin-bottom gray-color-lable"
      component={TextInput}
      handleFocus={() => {
        changePageShow('thankyou_page')
      }}
      handleBlur={() => {
        changePageShow('cart_page')
      }}
      label={I18n.t("Thank you page text")}
      eventName="click-design_product_button_text"
      spellCheck
      validate={[required()]}
    />
    <Field
      name="design.theme.product.redirection_text"
      className="margin-bottom gray-color-lable"
      component={TextInput}
      // handleFocus={() => {
      //   changePageShow('thankyou_page')
      // }}
      // handleBlur={() => {
      //   changePageShow('cart_page')
      // }}
      label={I18n.t("Redirection text")}
      eventName="click-design_redirection_text"
      spellCheck
    />
    {/* <div style={{ position: "relative" }}>
      <QuestionMark
        style={{ top: 0, right: 0 }}
        className="Question-cart-header"
        content={I18n.t(
          "Go to checkut text would show if your campaign has more than 1 offer, and your buyer added an item to his order"
        )}
      />
      <Field
        name="design.theme.product.go_to_checkout_text"
        className="margin-bottom"
        component={TextInput}
        multiline={3}
        label={I18n.t("Go to checkout text")}
        eventName="click-design_product_continue_to_checkout_text"
        spellCheck
      />
    </div> */}

    <Field
      className="margin-bottom"
      name="design.theme.product.go_to_checkout_bg_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t("Button color")}
      eventName="click-design_product_continue_to_checkout_button_color"
    />
    <Field
      className="margin-bottom"
      name="design.theme.product.go_to_checkout_text_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t("Button text color")}
      eventName="click-design_product_continue_to_checkout_button_text_color"
    />
    <Field
      className="margin-bottom"
      name="design.theme.product.show_description"
      component={CheckboxInput}
      fullWidth
      label={I18n.t("Show description")}
      eventName="click-design_product_show_description"
    />
    {show_description ? (
      <Field
        className="margin-bottom"
        name="design.theme.product.description_bg_color"
        fullWidth
        component={ColorPickerInput}
        label={I18n.t("Description bg color")}
      />
    ) : null}
    {show_description ? (
      <Field
        className=""
        name="design.theme.product.description_text_color"
        fullWidth
        component={ColorPickerInput}
        label={I18n.t("Description text color")}
      />
    ) : null}
  </Card>
);

export default Product;
