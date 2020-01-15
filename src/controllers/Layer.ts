import {Constructor} from "../utils/Mixin";
import {ILayerController, IMessageLayerController} from "./ILayerController";
import ElementHelper from "../utils/ElementHelper";
import {LoadingElement, MessageElement} from "./Element";

function FullSizeLayerMixin<T extends Constructor<ILayerController>>(base: T) {
    abstract class FullSizeLayer extends base implements ILayerController {
        e?: ElementHelper;

        onDraw(): void {
            const e = this.e;
            const bound = this.map.getBounds();
            if (e && bound) {
                const rect = this.boundToRect(bound);
                e.setPosition(rect);
            }
        }
    }

    return FullSizeLayer;
}

export function LoadingLayerMixin<T extends Constructor<ILayerController>>(base: T) {
    base = FullSizeLayerMixin(base);

    abstract class LoadingLayer extends base implements ILayerController {
        e?: ElementHelper;

        onAdd(): void {
            if (!this.e) {
                this.e = new LoadingElement();
            }

            const target = this.target(false);

            if (target) {
                target.append(this.e);
            }
        }

        onRemove(): void {
            const e = this.e;
            if (e) {
                e.remove();
            }
        }
    }

    return LoadingLayer;
}

export function MessageLayerMixin<T extends Constructor<ILayerController>>(base: T) {
    base = FullSizeLayerMixin(base);

    abstract class MessageLayer extends base implements IMessageLayerController {
        e?: ElementHelper;

        onAdd(): void {
            if (!this.e) {
                this.e = new MessageElement();
            }

            const target = this.target(false);

            if (target) {
                target.append(this.e);
            }
        }

        onRemove(): void {
            const e = this.e;
            if (e) {
                e.remove();
            }
        }

        html(html?: string): string | void {
            const e = this.e;

            if (e) {

                if (!html) {
                    return e.getHtml();
                }

                e.setHtml(html);
            }
        }

        text(text?: string): string | void {
            const e = this.e;

            if (e) {
                if (!text) {
                    return e.getText();
                }

                e.setText(text);
            }
        }
    }

    return MessageLayer;
}