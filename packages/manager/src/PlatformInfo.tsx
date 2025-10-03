
export const PlatformInfo = () => {
  return (
    <>
      <h2>Platform Info</h2>
      <ul id="platform-info">
        <li>Running on: {window.YASCML.stats.gameName}</li>
        <li>{window.SugarCube!.version.long()}</li>
        <li>YASCML v{window.YASCML.version}</li>
      </ul>
    </>
  )
};
