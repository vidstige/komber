import ko from "knockout";
import { Draggable, Layout, Mouse } from "./drag";

interface Input {

}
interface Output {

}

class Card implements Draggable {
    title: ko.Observable<string>;
    inputs: Input[];
    outputs: Output[];
    layout: Layout;
    constructor(title: string, layout: Layout, inputs: Input[], outputs: Output[]) {
        this.title = ko.observable(title);
        this.inputs = inputs;
        this.outputs = outputs;
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
    card(title: string, inputs: Input[], outputs: Output[]): Card {
        return new Card(title, new Layout(80, 40), inputs, outputs);
    }
}

const app = new App();
app.cards.push(app.card('virga', [1, 2], ['a']));
ko.applyBindings(app);

