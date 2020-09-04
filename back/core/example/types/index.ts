
import {arch, platform} from "os"
export namespace Core {

    export interface Config {

        arch: ReturnType<typeof arch>,
        platform: ReturnType<typeof platform>
    }

    
}
