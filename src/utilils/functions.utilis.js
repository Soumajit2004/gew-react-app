import {auth} from "../firebase/firebase.utils";

export const parseDate = ({date, reverse}) => {
    const ddDate = (int) => {
        if (int < 10){
            return `0${int.toString()}`
        }else{
            return int
        }
    }

    if (reverse) {
        return `${date.getFullYear()}-${ddDate(parseInt(date.getMonth())+1)}-${ddDate(parseInt(date.getDate()))}`
    }else{
        return `${ddDate(parseInt(date.getDate()))}-${ddDate(parseInt(date.getMonth())+1)}-${date.getFullYear()}`
    }
}

export const protectedRoute = () => {
    return !!auth.currentUser;
}