import { MessageCommmandFunction } from "../../command";

const executePing: MessageCommmandFunction = (msg) => {
    msg.channel.send("pong")
}

export default executePing;