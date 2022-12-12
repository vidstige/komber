import ko from "knockout";
import { Draggable, Layout, Mouse } from "./drag";

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

