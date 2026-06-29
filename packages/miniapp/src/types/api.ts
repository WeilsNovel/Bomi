/**
 * 接口类型入口 - 第三层
 *
 * 仅做 @bomi/shared 的类型再导出（单一事实来源在 shared，禁止在此重复定义 DTO）。
 * 业务代码可统一从 '@/types/api' 引入，也可直接从 '@bomi/shared' 引入。
 *
 * 小程序私有的「请求层」类型（非 DTO）定义在 core/request.ts。
 */
export type {
  BaseApiResponse,
  PageData,
  PageQuery,
  IdParam,
} from '@bomi/shared';
