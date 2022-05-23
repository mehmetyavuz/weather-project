import {mount} from "@vue/test-utils";
import UserCity from "@/components/UserCity.vue";

test("user name test", async () => {
    expect(UserCity).toBeTruthy();

    const wrapper = mount(UserCity, {
        data() {
            return {
                errorMessage: "there is an error"
            }
        }
    });

    expect(wrapper.text()).to.contain("there is an error");
})