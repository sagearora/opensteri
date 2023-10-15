export type UserInfo = {
    "x-cdnewco-username": string;
    "x-cdnewco-user_id": string;
    sub: string;
    email: string;
    name: string;
    given_name: string;
    middle_name: string | null;
    family_name: string;
}

export type Clinic = {
    self: string;
    kind: string;
    id: number;
    name: string;
    address: {
        line1: string;
        line2: string;
        city: string;
        countrySubdivision: string;
        country: string;
        postal: string;
    };
    officePhone: {
        number: string | null;
        extension: null;
    };
    faxPhone: {
        number: null;
        extension: null;
    };
    email: string;
    createdAt: string | null;
    updatedAt: string;
    createdById: number | null;
    updatedById: number;
    billingNumber: string;
    website: string;
    color: string;
    isActive: boolean;
    npi: null;
    tin: null;
    taxonomyNumber: null;
    payconexGroupName: null;
    defaultProviderId: number;
    logoUuid: string;
    logoUri: string;
    photoUuid: string;
    photoUri: string;
    defaultTreatmentPlanViewId: null;
    unitLengthMinutes: number;
    timeZone: string;
    can_update: boolean;
    can_delete: boolean;
};

export type CurveAppointment = {
    id: string;
    type: string;
    starttime_at: string;
    operatory_id: string;
    description: string;
    length: string;
    staffunits: null;
    provider_id: string;
    patient_id: string;
    appointment_status_id: string;
    recurrence_id: null | string;
    confirmation_id: string;
    visit_id: string;
    patient_self_bookable: string;
    created_at: string;
    created_by_id: string;
    updated_at: string;
    updated_by_id: string;
    has_notes: null;
    short_notice: ShortNotice;
    appointment_tags: Tag[];
    chargeable_items: ChargeableItem[];
    cost: string;
    patient: Patient;
    show_on_calendar: boolean;
    appointment_tag_names: Name[];
    provider_name: string;
    operatory_name: string;
    verified_online_booking: boolean;
    created_by_user_type: string;
};

type ShortNotice = {
    id: null;
    note: null;
};

type Tag = {
    id: string;
};

type ChargeableItem = {
    id: string;
    name: string;
};

type Patient = {
    id: string;
    default_dentist_id: string;
    default_fee_schedule_id: string;
    default_hygienist_id: null;
    dob_at: string;
    first_name: string;
    last_name: string;
    full_name: string;
    nickname: string;
    patient_status_id: string;
    prefered_contact_method_id: string;
    household_head: Head;
    responsible_party: ResponsibleParty;
    cell_phone: Phone;
    home_phone: Phone;
    work_phone: WorkPhone;
    other_allergies: null;
    other_conditions: null;
    created_by_user_type: string;
};

type Head = {
    id: string;
    first_name: string;
    last_name: string;
};

type ResponsibleParty = {
    first_name: string;
    last_name: string;
};

type Phone = {
    number: string | null;
};

type WorkPhone = {
    number: string | null;
    extension: string;
};

type Name = {
    name: string;
};