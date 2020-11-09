/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

import { mdiHexagon } from "@mdi/js";
import Icon from "@mdi/react";
import * as React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Progress, Row } from "reactstrap";
import ServerModuleModel from "../../modules/models/ServerModuleModel";
import { HealthStateToCssClassConverter } from "../converter/HealthStateToCssClassConverter";
import { HealthStateBadge } from "./HealthStateBadge";

interface ModulePropsModel {
    ServerModule: ServerModuleModel;
}

export class Module extends React.Component<ModulePropsModel, {}> {
    private healthStateCssConverter: HealthStateToCssClassConverter;

    constructor(props: ModulePropsModel) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {
        const stateCssClass = HealthStateToCssClassConverter.Convert(this.props.ServerModule.HealthState);

        return (
            <div className="modulebox-container">
                <Card className="modulebox">
                    <CardHeader tag="h3" className={"bg-" + stateCssClass.Background}>
                        <Link to={"/modules/" + this.props.ServerModule.Name} className={stateCssClass.Foreground}>
                            <Icon path={mdiHexagon} className="icon-white right-space" />
                            {this.props.ServerModule.Name}
                        </Link>
                    </CardHeader>
                    <CardBody className="modulebox-body">
                        <Container fluid={true}>
                            <Row>
                                <Col md={4}><span className="font-bold font-small">State:</span></Col>
                                <Col md={8}><span className="font-small"><HealthStateBadge HealthState={this.props.ServerModule.HealthState} /></span></Col>
                            </Row>
                            <Row>
                                <Col md={4}><span className="font-bold font-small">Assembly:</span></Col>
                                <Col md={8}><span className="font-small font-italic">{this.props.ServerModule.Assembly.Name}</span></Col>
                            </Row>
                            <Row>
                                <Col md={4}><span className="font-bold font-small">Version:</span></Col>
                                <Col md={8}><span className="font-small font-italic">{this.props.ServerModule.Assembly.Version}</span></Col>
                            </Row>
                            <Row>
                                <Col md={4}><span className="font-bold font-small">Info:</span></Col>
                                <Col md={8}><span className="font-small font-italic">{this.props.ServerModule.Assembly.InformationalVersion}</span></Col>
                            </Row>
                        </Container>
                    </CardBody>
                </Card>
            </div>
        );
    }
}
