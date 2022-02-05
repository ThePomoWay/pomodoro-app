import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, createCheckoutSession, manageBillingPortal } from "../../common/state/slices/TransactionSlice";
import { selectProducts, selectUserInfo } from "../../common/state/selectors";
import { useCallback } from "react";
import { getUserAsync, setUser } from "../../common/state/slices/UserSlice";

export function Pricing () {
    let allProducts = useSelector(selectProducts)
    let userInfo = useSelector(selectUserInfo)

    console.log(userInfo)

    let dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllProducts())
        dispatch(getUserAsync())

    }, [])

    let createCheckoutURL = useCallback((e) => {
        console.log("yodo ", e)
        dispatch(createCheckoutSession(e))
    })

    let createBillingPortalURL = useCallback((e) => {
        dispatch(manageBillingPortal())
    })

    console.log(allProducts)

    return (
        <div>
            {
                allProducts.map(items => (<button onClick={(e) => createCheckoutURL(items.stripeID)}>{items.unit_amount / 100}</button>))
            }
            <br />
            <br />
            <p> Plan Expiry : {userInfo && userInfo.expiry || ""} </p>
            <p> Plan Status : {userInfo &&  userInfo.subscription && userInfo.subscription.status || ""} </p>
            <p> UpdatedOn : {userInfo && userInfo.subscription && userInfo.subscription.updatedOn || ""} </p>

            <p> Open billing portal </p>

            <button onClick={(e) => createBillingPortalURL()}> Manage billing portal </button>
        </div>
    )
}