/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import * as React from "react";

export interface WrapPanelProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

const WrapPanel: React.StatelessComponent<WrapPanelProps> = (props, {children}) => {
  return <div className={props.className} style={{display: "flex", flexWrap: "wrap"}}>{props.children}</div>;
};

export default WrapPanel;
