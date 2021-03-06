export type inputTypes = Preset | number | string | boolean
export class Container {
    prefix: string
    commands: Command[]

    constructor(prefix: string) {
        this.prefix = prefix;
        this.commands = [];
    }
}

export class Command {
    container: string
    make: (...params: inputTypes[]) => string
    attachments: number
    description: string

    constructor(
        container: string,
        make: (...params: any) => string,
        description: string,
        attachments = 1
    ) {
        this.container = container;
        this.make = make;

        this.description = description;
        this.attachments = attachments;
    }

    createCommand(...params: inputTypes[]): string {
        return this.make(...params);
    }
}

export class Preset {
    command: string
    description: string

    constructor(command: string, description: string) {
        this.command = command;
        this.description = description;
    }
}