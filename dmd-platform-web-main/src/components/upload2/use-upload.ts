import type { Ref } from 'vue';
import type { AxiosProgressEvent } from 'axios';
import { computed, unref } from 'vue';
import { useI18n } from '@/hooks/web/useI18n';
import { useGlobSetting } from '@/hooks/setting';
import { defHttp } from '@/utils/http/axios';

const { t } = useI18n();
const { uploadUrl = '' } = useGlobSetting();

/**
 * 上传类型
 */
enum UPLOAD_TYPE {
  // 客户端直接上传（只支持S3服务）
  CLIENT = 'client',
  // 客户端发送到后端上传
  SERVER = 'server',
}

export function useUploadType({
  acceptRef,
  helpTextRef,
  maxNumberRef,
  maxSizeRef,
}: {
  acceptRef: Ref<string[]>
  helpTextRef: Ref<string>
  maxNumberRef: Ref<number>
  maxSizeRef: Ref<number>
}) {
  // 文件类型限制
  const getAccept = computed(() => {
    const accept = unref(acceptRef);
    if (accept && accept.length > 0) {
      return accept;
    }

    return [];
  });
  const getStringAccept = computed(() => {
    return unref(getAccept)
      .map((item) => {
        if (item.indexOf('/') > 0 || item.startsWith('.')) {
          return item;
        } else {
          return `.${item}`;
        }
      })
      .join(',');
  });

  // 支持jpg、jpeg、png格式，不超过2M，最多可选择10张图片。
  const getHelpText = computed(() => {
    const helpText = unref(helpTextRef);
    if (helpText) {
      return helpText;
    }

    const helpTexts: string[] = [];

    const accept = unref(acceptRef);
    if (accept.length > 0) {
      helpTexts.push(t('component.upload.accept', [accept.join(',')]));
    }

    const maxSize = unref(maxSizeRef);
    if (maxSize) {
      helpTexts.push(t('component.upload.maxSize', [maxSize]));
    }

    const maxNumber = unref(maxNumberRef);
    if (maxNumber && maxNumber !== Number.POSITIVE_INFINITY) {
      helpTexts.push(t('component.upload.maxNumber', [maxNumber]));
    }

    return helpTexts.join('，');
  });
  return { getAccept, getStringAccept, getHelpText };
}

// TODO @芋艿：目前保持和 admin-vue3 一致，后续可能重构
export function useUpload(_directory?: string) {
  // 后端上传地址
  const uploadApiUrl = getUploadUrl();
  // 是否使用前端直连上传
  const isClientUpload = UPLOAD_TYPE.CLIENT === import.meta.env.VITE_UPLOAD_TYPE;

  // 重写Upload上传方法
  async function httpRequest(
    file: File,
    onUploadProgress?: AxiosProgressEvent,
  ) {
    // 模式一：前端直连上传（当前项目暂不支持，注释掉）
    // if (isClientUpload) {
    //   // 1.1 生成文件名称
    //   const fileName = await generateFileName(file)
    //   // 1.2 获取文件预签名地址
    //   const presignedInfo = await getFilePresignedUrl(fileName, directory)
    //   // 1.3 上传文件
    //   return baseRequestClient
    //     .put(presignedInfo.uploadUrl, file, {
    //       headers: {
    //         'Content-Type': file.type,
    //       },
    //     })
    //     .then(() => {
    //       // 1.4. 记录文件信息到后端（异步）
    //       createFile0(presignedInfo, file)
    //       // 通知成功，数据格式保持与后端上传的返回结果一致
    //       return { url: presignedInfo.url }
    //     })
    // } else {
    //   // 模式二：后端上传
    //   return uploadFile({ file, directory }, onUploadProgress)
    // }

    // 当前只支持后端上传模式
    return defHttp.uploadFile<{ url: string }>(
      {
        url: uploadApiUrl,
        onUploadProgress,
      },
      { file },
    );
  }

  return {
    uploadUrl: uploadApiUrl,
    httpRequest,
    isClientUpload,
  };
}

/**
 * 获得上传 URL
 */
export function getUploadUrl(): string {
  return uploadUrl;
}

// /**
//  * 创建文件信息 - 当前项目暂不支持前端直连上传，注释掉
//  *
//  * @param vo 文件预签名信息
//  * @param file 文件
//  */
// function createFile0(
//   vo: any,
//   file: File,
// ): any {
//   const fileVO = {
//     configId: vo.configId,
//     url: vo.url,
//     path: vo.path,
//     name: file.name,
//     type: file.type,
//     size: file.size,
//   }
//   // createFile(fileVO)
//   return fileVO
// }

// /**
//  * 生成文件名称（使用算法SHA256）- 当前项目暂不支持，注释掉
//  *
//  * @param file 要上传的文件
//  */
// async function generateFileName(file: File) {
//   return file.name
// }
