const FRAME_INTERVAL_TIME = 16.67

enum MouseButtonsEnum {
  /**
   * 没有按键
   */
  NoClick = 0,
  /**
   * 只按左键
   */
  Left = 1,
  /**
   * 只按中键
   */
  Middle = 4,
  /**
   * 只按右键
   */
  Right = 2,
}

enum MouseButtonEnum {
  /**
   * 只按左键
   */
  Left = 0,
  /**
   * 只按中键
   */
  Middle = 1,
  /**
   * 只按右键
   */
  Right = 2,
  /**
   * 没有按键
   */
  Empty = -1,
}

export { FRAME_INTERVAL_TIME, MouseButtonEnum, MouseButtonsEnum }
