const dateFilter = require("../scripts/DateFilter");
function objComp (a, b){
    if(a == null && b == null){
        return true;
    }
    if(a == null || b == null){
        return false;
    }

    aKeys = Object.keys(a);
    bKeys = Object.keys(b);
    if(aKeys.length != bKeys.length){
        return false;
    }

    for (key in aKeys){
        if(a.key != b.key){
            return false;
        }
    }
    return true;
}

describe ("Testing Date Comparison Functionality", () => {
    var sampleDates;
    var convertedDates;
    beforeAll(() => {
        sampleDates = [
            "12-12-20011",
            "12-12-2001",
            "1/ 2/ 2002",
            "1/2/2002",
            "    1/2/2003",
            "1-2-2003",
            "12-32-2001",
            "2-30-2001"
        ];

        convertedDates = [];
        for (i in sampleDates){
            date = dateFilter.validateDate(sampleDates[i]);
             convertedDates.push(date);
        }
 
      });

    it ("Testing String to Object Conversion", () => {
        expect(convertedDates[0]).toBe(undefined);
        expect(objComp(convertedDates[1], {day:12, month:12, year:2001})).toBe(true);
        expect(objComp(convertedDates[2], {day:2, month:1, year:2002})).toBe(true);
        expect(objComp(convertedDates[3], {day:2, month:1, year:2002})).toBe(true);
        expect(objComp(convertedDates[4], {day:2, month:1, year:2003})).toBe(true);
        expect(objComp(convertedDates[5], {day:2, month:1, year:2003})).toBe(true);
        expect(convertedDates[6]).toBe(undefined);
        expect(convertedDates[7]).toBe(undefined);
    }); 

    it("Testing Less than comparison", () =>{
        expect(dateFilter.isLessThan(convertedDates[1], convertedDates[2])).toBe(true);
        expect(dateFilter.isLessThan(convertedDates[2], convertedDates[1])).toBe(false);
        expect(dateFilter.isLessThan(convertedDates[2], convertedDates[3])).toBe(false);
        expect(dateFilter.isLessThan(convertedDates[3], convertedDates[4])).toBe(true);
        expect(dateFilter.isLessThan(convertedDates[4], convertedDates[5])).toBe(false);
    });

    it("Testing Equal-To comparison", () => {
        expect(dateFilter.isEqualTo(convertedDates[1], convertedDates[2])).toBe(false);
        expect(dateFilter.isEqualTo(convertedDates[2], convertedDates[3])).toBe(true);
        expect(dateFilter.isEqualTo(convertedDates[3], convertedDates[4])).toBe(false);
        expect(dateFilter.isEqualTo(convertedDates[4], convertedDates[5])).toBe(true);
    });

    it("Testing Greater Than", () => {
        expect(dateFilter.isGreaterThan(convertedDates[1], convertedDates[2])).toBe(false);
        expect(dateFilter.isGreaterThan(convertedDates[2], convertedDates[1])).toBe(true);
        expect(dateFilter.isGreaterThan(convertedDates[2], convertedDates[3])).toBe(false);
        expect(dateFilter.isGreaterThan(convertedDates[3], convertedDates[4])).toBe(false);
        expect(dateFilter.isGreaterThan(convertedDates[4], convertedDates[3])).toBe(true);
        expect(dateFilter.isGreaterThan(convertedDates[4], convertedDates[5])).toBe(false);
    });

    
    it("Testing Greater Than or Equal To", () => {
        expect(dateFilter.isGreaterThanEqualTo(convertedDates[1], convertedDates[2])).toBe(false);
        expect(dateFilter.isGreaterThanEqualTo(convertedDates[2], convertedDates[1])).toBe(true);
        expect(dateFilter.isGreaterThanEqualTo(convertedDates[2], convertedDates[3])).toBe(true);
        expect(dateFilter.isGreaterThanEqualTo(convertedDates[3], convertedDates[4])).toBe(false);
        expect(dateFilter.isGreaterThanEqualTo(convertedDates[4], convertedDates[3])).toBe(true);
        expect(dateFilter.isGreaterThanEqualTo(convertedDates[4], convertedDates[5])).toBe(true);
    });

    it("Testing Less Than or Equal To comparison", () =>{
        expect(dateFilter.isLessThanEqualTo(convertedDates[1], convertedDates[2])).toBe(true);
        expect(dateFilter.isLessThanEqualTo(convertedDates[2], convertedDates[1])).toBe(false);
        expect(dateFilter.isLessThanEqualTo(convertedDates[2], convertedDates[3])).toBe(true);
        expect(dateFilter.isLessThanEqualTo(convertedDates[3], convertedDates[4])).toBe(true);
        expect(dateFilter.isLessThanEqualTo(convertedDates[4], convertedDates[3])).toBe(false);
        expect(dateFilter.isLessThanEqualTo(convertedDates[4], convertedDates[5])).toBe(true);
    });

});