/**
 * UI 组件参数类型 - 第三层（组件标准参数）
 *
 * 所有通用 UI 组件定义完整 TS 类型 + DEFAULT 默认兜底，支持外部 params 覆盖。
 * 接口 DTO 类型不在此处，统一引用 @bomi/shared。
 */

/** 通用 UI 组件参数基础类型 */
export interface BaseComponentParams {
  /** 是否显示 */
  visible?: boolean;
  /** 自定义类名 */
  customClass?: string;
  /** 自定义样式 */
  customStyle?: Record<string, string>;
}

/** 按钮类型 */
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'default';

/** 按钮尺寸 */
export type ButtonSize = 'large' | 'medium' | 'small' | 'mini';

/** 按钮组件参数 */
export interface ButtonComponentParams extends BaseComponentParams {
  /** 按钮文案 */
  text: string;
  /** 按钮类型 */
  type: ButtonType;
  /** 按钮尺寸 */
  size: ButtonSize;
  /** 是否禁用 */
  disabled: boolean;
  /** 是否加载中 */
  loading: boolean;
}

/** 按钮组件默认参数（缺失字段兜底） */
export const DEFAULT_BUTTON_PARAMS: ButtonComponentParams = {
  visible: true,
  customClass: '',
  customStyle: {},
  text: '',
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
};
