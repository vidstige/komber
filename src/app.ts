import ko from "knockout";
import { Draggable, Layout, Mouse } from "./drag";

interface Named {
    name: string;
}
interface Input extends Named {
    el?: ko.Observable<HTMLElement | undefined>;
}
interface Output extends Named {
    el?: ko.Observable<HTMLElement | undefined>;
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

class Connector {
    constructor(
        public from: Card,
        public from_index: number,
        public to: Card,
        public to_index: number)
    {}
    from_output() {
        return this.from.outputs[this.from_index];
    }
    to_input() {
        return this.to.inputs[this.to_index];
    }
}


class App {
    cards: ko.ObservableArray<Card>;
    connectors: ko.ObservableArray<Connector>;
    mouse: Mouse<Card>;
    constructor() {
        this.cards = ko.observableArray();
        this.connectors = ko.observableArray();
        this.mouse = new Mouse();
    }
    card(title: string, inputs: Input[], outputs: Output[]): Card {
        const layout = new Layout(Math.floor(Math.random() * 600), Math.floor(Math.random() * 600));
        // create element holders
        for (var input of inputs) input.el = ko.observable();
        for (var output of outputs) output.el = ko.observable();

        return new Card(title, layout, inputs, outputs);
    }
    connect(from: Card, from_index: number, to: Card, to_index: number) {
        this.connectors.push(new Connector(from, from_index, to, to_index));
    }
}

// for storing DOM elements in the view model
ko.bindingHandlers.element = {
    init: function(element, valueAccessor) {
        var target = valueAccessor();
        target(element);
    }
};

function _draw(ctx: CanvasRenderingContext2D, el0: HTMLElement, el1: HTMLElement) {
    const rect0 = el0.getBoundingClientRect();
    const rect1 = el1.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo((rect0.left + rect0.right) / 2, (rect0.top + rect0.bottom) / 2);
    ctx.lineTo((rect1.left + rect1.right) / 2, (rect1.top + rect1.bottom) / 2);
    ctx.stroke();
}
function _draw_connectors(element: HTMLElement, valueAccessor: Function) {
    const canvas = element as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const connectors: Connector[] = ko.unwrap(valueAccessor());
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var connector of connectors) {
        // Workaround: use layout property to subscribe to updates
        connector.from.layout.left();
        connector.to.layout.left();

        const from_element = connector.from_output().el?.();
        const to_element = connector.to_input().el?.();
        if (from_element && to_element) {
            _draw(ctx, from_element, to_element);
        }
    }
}

class ConnectorsBinding {
    init(element: HTMLElement, valueAccessor: Function, allBindings, viewModel, bindingContext) {
        _draw_connectors(element, valueAccessor);        
    }
    update(element: HTMLElement, valueAccessor: Function, allBindings, viewModel, bindingContext) {
        _draw_connectors(element, valueAccessor);
    }
}

ko.bindingHandlers.connectors = new ConnectorsBinding();

const app = new App();
// example cards
const constant = app.card('constant', [], [{name: 'value'}]);
const virga = app.card('virga', [{name: 'urnid'}], [{name: 'rgb'}, {name: 'ir'}])
app.cards.push(constant);
app.cards.push(virga);
app.connect(constant, 0, virga, 0);

ko.applyBindings(app);

