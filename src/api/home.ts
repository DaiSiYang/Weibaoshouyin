import http from '@/utils/http'


export const testsecondary = () => {
    return http.post('/secondary/visit')
}