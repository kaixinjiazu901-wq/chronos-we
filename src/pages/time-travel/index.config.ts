export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '时光穿梭',
      navigationBarBackgroundColor: '#0f0524',
      navigationBarTextStyle: 'white',
      backgroundColor: '#020617'
    })
  : {
      navigationBarTitleText: '时光穿梭',
      navigationBarBackgroundColor: '#0f0524',
      navigationBarTextStyle: 'white',
      backgroundColor: '#020617'
    }
