import { css } from '@emotion/react';

export const styles = {
  textField: css`
    margin-bottom: 15px;
  `,
  addButton: css`
    margin: 15px 0;
    max-width: 200px;
  `,
  accordion: css`
    & .MuiAccordionSummary-root {
      display: flex;
      flex-direction: row-reverse;
    };
    & .MuiAccordionSummary-content {
      margin: 10px 0
    };
  `,
  titleBox: css`
    width: 100%;
    display: flex;
    align-items: center;
    margin-inline-start: 10px;
  `,
  textBox: css`
    padding: 0 10px 20px;
    width: 100%;
  `
}
