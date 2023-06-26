import { Autocomplete, Icon, Layout } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import ViewModel from "./viewModel";

function AutocompleteExample() {
  const model = ViewModel();

  const textField = (
    <Autocomplete.TextField
      onChange={model?.updateText}
      label="Search Products"
      value={model?.inputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search Title..."
      autoComplete="off"
    />
  );

  return (
    <Layout.AnnotatedSection>
      <div
        style={{
          height: "auto",
          width: "clamp(400px, 50%, 500px)",
          marginTop: "3em",
          marginBottom: "2em",
        }}
      >
        <Autocomplete
          loading={model?.options.length > 0 ? false : true}
          options={model?.options}
          selected={model?.selectedOptions}
          onSelect={model?.updateSelection}
          textField={textField}
        />
      </div>
    </Layout.AnnotatedSection>
  );
}

export default AutocompleteExample;
