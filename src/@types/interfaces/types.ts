export interface GetBoatProps {
    id: string;
    name: string;
    color: string;
    max_people: number;
    created_at: string;
    updated_at: string;
    appointments: [
        {
            id: string;
            date: string;
            turn: string;
            people_quantity: number;
            client_name: string;
            client_phone: string;
            client_email: string;
            payment_type: string;
            value: number;
            total_value: number;
            user_id: string;
            created_at: string;
            updated_at: string;
            speedboat_id: string;
        }
    ];
}

export interface GetBoatSelection {
    id: string;
    name: string;
}

export interface GetAppointmentsProps {
    id: string;
    date: string;
    turn: string;
    people_quantity: string;
    client_name: string;
    client_phone: string;
    client_email: string;
    client_document: string;
    payment_type: string;
    value: number;
    total_value: number;
    user_id: string;
    created_at: string;
    updated_at: string;
    speedboat_id: string;
    additionals: [
        {
            appointment_id: string;
            additional_id: string;
            created_at: string;
            updated_at: string;
            aditional: {
                id: string;
                name: string;
                value: number;
                created_at: string;
                updated_at: string;
            }
        }
    ],
    user: {
        id: string;
        name: string;
        last_name: string;
        password: string;
        email: string;
        phone: string;
        user_type: string;
        created_at: string;
        updated_at: string;
    },
    speedboat: {
        id: string;
        name: string;
        color: string;
        max_people: number;
        created_at: string;
        updated_at: string;
    }

}

export interface GetAdditionalProps {
    title: string;
    data: {
        id: string;
        client_name: string;
        turn: string;
    }
}

export interface AdditionalProps {
    id: string;
    name: string;
    value: number;
    created_at: string;
    updated_at: string;
}

export interface AdditonalResponseShow {
    appointment_id: string;
    additional_id: string;
    created_at: string;
    updated_at: string;
    aditional: {
        id: string;
        name: string;
        value: number;
        created_at: string;
        updated_at: string;
    }
}

export interface DashProps {
    appointments: [
        {
            id: string;
			date: string;
			turn: string;
			people_quantity: string;
			client_name: string;
			client_phone: string;
			client_email: string;
			client_document: string;
			payment_type: string;
			value: number;
			total_value: number;
			user_id: string;
			created_at: string;
			updated_at: string;
			speedboat_id: string;
			speedboat: {
				id: string;
				name: string;
				max_people: number;
				created_at: string;
				updated_at: string;
			}
        }
    ],
    total_appointments: number;
}