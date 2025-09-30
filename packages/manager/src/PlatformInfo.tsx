
export const PlatformInfo = () => {
  return (
    <>
      <h2>Platform Info</h2>
      <ul id="platform-info">
        <li>{window.SugarCube!.version.long()}</li>
        <li>YASCML v{window.YASCML.version}</li>
      </ul>
    </>
  )
};
