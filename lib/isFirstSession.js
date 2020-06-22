export default function isFirstSession(){
    if(!localStorage.isFirstSession){
        localStorage.isFirstSession = true;
        return true;
    } else {
        return false;
    }
}