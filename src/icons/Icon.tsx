import { CSSProperties, FunctionComponent } from "react";

export type IconProps = {
  size?: CSSProperties["fontSize"];
  styles?: CSSProperties;
};

type IconPropsInner = IconProps & {
  identifier: string;
};

export const Icon: FunctionComponent<IconPropsInner> = ({
  identifier,
  size,
  styles,
}) => <i className={identifier} style={{ fontSize: size, ...styles }} />;
