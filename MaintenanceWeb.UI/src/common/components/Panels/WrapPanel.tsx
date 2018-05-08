import * as React from "react";

export interface IWrapPanelProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

const WrapPanel: React.StatelessComponent<IWrapPanelProps> = (props, {children}) => {
  return <div className={props.className} style={{display: "flex", flexWrap: "wrap"}}>{props.children}</div>;
};

export default WrapPanel;
