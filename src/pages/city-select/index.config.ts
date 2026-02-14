export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '选择城市',
      navigationBarBackgroundColor: '#0f0524',
      navigationBarTextStyle: 'white',
      backgroundColor: '#020617'
    })
  : {
      navigationBarTitleText: '选择城市',
      navigationBarBackgroundColor: '#0f0524',
      navigationBarTextStyle: 'white',
      backgroundColor: '#020617'
    }
