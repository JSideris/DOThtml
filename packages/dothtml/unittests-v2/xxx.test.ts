import { dot } from "../src";


test("Experimental", ()=>{
	expect(dot.useStyles).not.toBeNull();
	expect(dot.useStyles).not.toBeUndefined();
})