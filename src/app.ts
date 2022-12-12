import ko from "knockout";

class Layout {
    left: ko.Observable<number>;
    top: ko.Observable<number>;
    constructor(left: number, top: number) {
        this.left = ko.observable(left);
        this.top = ko.observable(top);
    }
}
interface Draggable {
    layout: Layout;
}

class Drag<T extends Draggable> {
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


class Mouse<T extends Draggable> {
    public drag: Drag<T> | null;
    constructor() {
        this.drag = null;
    }
    down(source: T, e: MouseEvent) {
        this.drag = new Drag(source as T, e);
    }
    up(source: T, e: MouseEvent) {
        this.drag = null;
    }
    move(source: T, e: MouseEvent) {
        if (this.drag) {
            this.drag.source.layout.left(this.drag.originalX + e.screenX - this.drag.start.screenX);
            this.drag.source.layout.top(this.drag.originalY + e.screenY - this.drag.start.screenY);
        }
    }
}


class Card implements Draggable {
    title: ko.Observable<string>;
    layout: Layout;
    constructor(title: string, layout: Layout) {
        this.title = ko.observable(title);
        this.layout = layout;
    }
}

class App {
    cards: ko.ObservableArray<Card>;
    mouse: Mouse<Card>;
    constructor() {
        this.cards = ko.observableArray();
        this.mouse = new Mouse();
    }
    card(title: string): Card {
        return new Card(title, new Layout(80, 40));
    }
}

const app = new App();
app.cards.push(app.card('virga'));
ko.applyBindings(app);

