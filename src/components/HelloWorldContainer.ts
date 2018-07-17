import { Component, createElement } from "react";

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
}

export interface ContainerState {
    backgroundColor: string;
}

export default class HelloWorldContainer extends Component<ContainerProps, ContainerState > {

    constructor(props: ContainerProps) {
        super(props);
    }

    render() {
        // <div class="my-custom-helloworld-widget">
        //     <input type="color" class="color-picker"> // select a color
        //     <Input type="text-area" class="content-area"> // apply selected color here
        // </div>
        return createElement("div", { className: "my-custom-helloworld-widget" },
            createElement("input", { type: "color", className: "color-picker", onChange: this.onChange }),
            createElement("textarea", { className: "content-area" })
        );
    }

    public static parseStyle(style = ""): {[key: string]: string} {
        try {
            return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
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
