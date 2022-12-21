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
    target: T;
    originalX: number;
    originalY: number;
    start: MouseEvent;
    constructor(target: T, event: MouseEvent) {
        this.target = target;
        this.originalX = target.layout.left();
        this.originalY = target.layout.top();
        this.start = event;
    }
}

export class MouseDrag {

}

export class Mouse<T extends Draggable> {
    public drag: Drag<T> | null;
    constructor() {
        this.drag = null;
    }
    down(source: T, e: MouseEvent) {
        this.drag = new Drag(source as T, e);
    }
    up(e: MouseEvent) {
        this.drag = null;
    }
    move(e: MouseEvent) {
        if (this.drag) {
            this.drag.target.layout.left(this.drag.originalX + e.clientX - this.drag.start.clientX);
            this.drag.target.layout.top(this.drag.originalY + e.clientY - this.drag.start.clientY);
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