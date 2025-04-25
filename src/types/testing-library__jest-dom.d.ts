import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, string | number>): R;
      toBeEmpty(): R;
      toBeEmptyDOMElement(): R;
      toHaveFocus(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toBeEnabled(): R;
      toBeEmpty(): R;
      toBeInTheDocument(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | string[]): R;
      toHaveErrorMessage(text: string | RegExp): R;
      toHaveFormValues(values: Record<string, string | number | boolean>): R;
      toHaveValue(value: string | string[] | number): R;
    }
  }
}
