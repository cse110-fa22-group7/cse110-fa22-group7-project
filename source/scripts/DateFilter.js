

function isValidDate(date){
    return true; //super useful
}
export function isLessThan(a, b){
    if(!isValidDate(a) || !isValidDate(b)){
        console.log("Invalid Date Values!");
        return None;
    }
    
    a = a.split("-");
    if(a[0].length == 4){
        //reformat a
        let newA = [a[1], a[2], a[0]];
        a = newA;
    }
    b = b.split("-");
    if(b[0].length == 4){
        let newB = [b[1], b[2], b[0]];
        b = newB;
    }

    if(parseInt(a[2]) < parseInt(b[2])){ // Comp year;
        return true;
    }
    if(parseInt(a[2]) == parseInt(b[2])){ //If same year...
        if(parseInt(a[0]) < parseInt(b[0])){ //compare month
            return true;
        }
        else if(parseInt(a[0]) == parseInt(b[0])){ //if same month comp day
            if(parseInt(a[1]) < parseInt(b[1])){
                return true;
            }
        }
    }
    //otherwise false
    return false;
}

export function isEqualTo(a, b){
    //check if valid

    //could probably just compare directly... return(a == b); a = a.split("-");
    a = a.split("-");
    if(a[0].length == 4){
        //reformat a
        let newA = [a[1], a[2], a[0]];
        a = newA;
    }
    b = b.split("-");
    if(b[0].length == 4){
        let newB = [b[1], b[2], b[0]];
        b = newB;
    }
    
    return (a[0] == b[0] && a[1] == b[1] && a[2] == b[2]);
}

export function isGreaterThan(a, b){
    return (!isEqualTo(a, b) && !isLessThan(a, b));
}