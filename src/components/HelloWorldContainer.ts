import { CSSProperties, Component, createElement } from "react";

import "../ui/HelloWorld.scss";

interface WrapperProps {
    class: string;
    mxObject?: mendix.lib.MxObject;
    mxform: mxui.lib.form._FormBase;
    style: string;
    readOnly: boolean;
    friendlyId: string;
}

export interface ContainerProps extends WrapperProps {
    captionName: string;
    messageAttribute: string;
    colorAttribute: string;
    mfToExecute?: string;
}

export interface ContainerState {
    colorAttribute?: string;
    messageAttribute?: string;
}

export default class HelloWorldContainer extends Component<ContainerProps, ContainerState> {

    readonly state = {
        colorAttribute: this.props.mxObject
            ? this.props.mxObject.get(this.props.colorAttribute) as string
            : undefined,
        messageAttribute: this.props.mxObject
            ? this.props.mxObject.get(this.props.messageAttribute) as string
            : ""
    };

    constructor(props: ContainerProps) {
        super(props);

        // this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { mxObject } = this.props;
        // const backgroundColor = mxObject ? mxObject.get(this.props.backgroundColor) : undefined;
        const message = mxObject ? mxObject.get(this.props.messageAttribute) : "";
        return createElement("div",
            {
                className: "my-custom-helloworld-widget"
            },
            createElement("input", { type: "color", className: "color-picker", onChange: this.handleChange.bind(this), value: this.state.colorAttribute }),
            createElement("textarea", {
                className: "content-area",
                style: { backgroundColor: this.state.colorAttribute } as CSSProperties,
                value: message // check documentation
            }, message)

        );
    }

    private handleChange(event: Event) {
        const colorAttribute = (event.target as HTMLInputElement).value;
        this.setState({ colorAttribute });
        if (this.props.mxObject) {
            this.props.mxObject.set(this.props.colorAttribute, colorAttribute);
        }

    }

    public static parseStyle(style = ""): { [key: string]: string } {
        try {
            return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            HelloWorldContainer.logError("Failed to parse style", style, error);
        }

        return {};
    }

    public static logError(message: string, style?: string, error?: any) {
        // tslint:disable-next-line:no-console
        window.logger ? window.logger.error(message) : console.log(message, style, error);
    }
}
