

// 获取应用配置
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import router from "@/router";
import {aesECBDecrypt} from "@/utils/passwordUtil";
import { setRuntimeKey } from "@/store/modules/secureKeyStore";

export interface LoginConfigInterface {
    terminal_code: string,
    terminal_name: string,
    api_prefix: string,
    app_name: string,
    terminal_key: string,
    user_agreement: string,
    privacy_policy: string
}


export const useLoginConfig = defineStore('loginConfig', () => {

    const terminal_code = ref<string>("web")

    const LoginConfigData = ref<LoginConfigInterface>({
        terminal_code: "",
        terminal_name: "",
        api_prefix: "",
        app_name: "",
        terminal_key: "",
        user_agreement: "",
        privacy_policy: ""
    })

    const decryptTerminalKey = ref<string>("")


    // const setLoginConfigData = (data: LoginConfigInterface) => {
    //     LoginConfigData.value = data
    // }

    const setLoginConfigData = (data: LoginConfigInterface) => {
        LoginConfigData.value = data
        const decryptedKey = aesECBDecrypt(data.terminal_key, data.terminal_code)
        setRuntimeKey(decryptedKey)
    }


    return{
        terminal_code,
        LoginConfigData,
        setLoginConfigData,
    }

}, {
    persist: true
})