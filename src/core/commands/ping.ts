import { MessageCommmandFunction } from "../../command";
import { buttonClient } from "../../globals";

export const pingButton = new buttonClient.MessageButton({
    style: "green",
    label: "Retry",
    id: "ping",
})

const executePing: MessageCommmandFunction = (msg) => {
    //@ts-ignore
    msg.channel.send(`${msg.author} pong`, { buttons: [pingButton] })
}

export default executePing;