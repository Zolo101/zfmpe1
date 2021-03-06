export type inputTypes = Xfmpe1Preset | number | string | boolean
export class Xfmpe1Container {
    prefix: string
    commands: Xfmpe1Command[]

    constructor(prefix: string) {
        this.prefix = prefix;
        this.commands = [];
    }
}

export class Xfmpe1Command {
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

export class Xfmpe1Preset {
    command: string
    description: string

    constructor(command: string, description: string) {
        this.command = command;
        this.description = description;
    }
}