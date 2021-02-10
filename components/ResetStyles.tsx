const style = `
* {
    margin: 0;
    padding: 0;
}
  a.active {
    font-weight: bold;
  }
  `;

export const ResetStyles = () => {
  return <style>{style}</style>;
};

export default ResetStyles;
