export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '精神国度',
      navigationBarBackgroundColor: '#0f0524',
      navigationBarTextStyle: 'white',
      backgroundColor: '#020617'
    })
  : {
      navigationBarTitleText: '精神国度',
      navigationBarBackgroundColor: '#0f0524',
      navigationBarTextStyle: 'white',
      backgroundColor: '#020617'
    }
