import ko from "knockout";

export class Layout {
    left: ko.Observable<number>;
    top: ko.Observable<number>;
    constructor(left: number, top: number) {
        this.left = ko.observable(left);
        this.top = ko.observable(top);
    }
}
export interface Draggable {
    layout: Layout;
}

// Object that lives _during_ a mouse drag
export class Drag<T extends Draggable> {
    source: T;
    originalX: number;
    originalY: number;
    start: MouseEvent;
    constructor(source: T, event: MouseEvent) {
        this.source = source;
        this.originalX = source.layout.left();
        this.originalY = source.layout.top();
        this.start = event;
    }
}

export class MouseDrag {

}

export class Mouse<T extends Draggable> {
    public drag: Drag<T> | null;
    public area: ThisType<T>;
    constructor() {
        this.drag = null;
        this.area = this;
    }

    down(source: T, e: MouseEvent) {
        this.drag = new Drag(source as T, e);
    }
    up(e: MouseEvent) {
        this.drag = null;
    }
    move(e: MouseEvent) {
        if (this.drag) {
            this.drag.source.layout.left(this.drag.originalX + e.clientX - this.drag.start.clientX);
            this.drag.source.layout.top(this.drag.originalY + e.clientY - this.drag.start.clientY);
        }
    }
}

export class MouseBinding {
    init(element: HTMLElement, valueAccessor: Function, allBindings, viewModel, bindingContext) {
        let mouse = valueAccessor();
        element.onmousemove = mouse.move.bind(mouse);        
        element.onmouseup = mouse.up.bind(mouse);
    }
    update(element: HTMLElement, valueAccessor: Function, allBindings, viewModel, bindingContext) {
    }
}