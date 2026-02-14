export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: 'Chronos',
      navigationBarBackgroundColor: '#0f0524',
      navigationBarTextStyle: 'white',
      backgroundColor: '#020617'
    })
  : {
      navigationBarTitleText: 'Chronos',
      navigationBarBackgroundColor: '#0f0524',
      navigationBarTextStyle: 'white',
      backgroundColor: '#020617'
    }
