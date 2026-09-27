export function changeRoleToPersion(role) {
    if(role === 'employer') return 'کارفرما'
    return 'کارگر'
}

export function changeReqStatusToPersion(status) {
    if(status === 'open') return 'موجود است'
    if(status === 'pending') return 'در انتظار'
    if(status === 'rejected') return 'رد شد'
    if(status === 'accept') return 'تایید شده'
}