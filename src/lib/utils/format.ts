import * as prettier from "prettier";

export const formatCode = async (
  content: string,
  filepath: string
): Promise<string> => {
  try {
    const config = await prettier.resolveConfig(filepath);
    return await prettier.format(content, { ...config, filepath });
  } catch {
    return content;
  }
};
