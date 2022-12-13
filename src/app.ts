import ko from "knockout";
import { Draggable, Layout, Mouse } from "./drag";

interface Named {
    name: string;
}
interface Input extends Named {
}
interface Output extends Named {
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
        const layout = new Layout(Math.floor(Math.random() * 600), Math.floor(Math.random() * 600));
        return new Card(title, layout, inputs, outputs);
    }
}

const app = new App();
app.cards.push(app.card('constant', [], [{name: 'value'}]));
app.cards.push(app.card('virga', [{name: 'urnid'}], [{name: 'rgb'}, {name: 'ir'}]));
ko.applyBindings(app);

