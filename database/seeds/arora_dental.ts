import { Knex } from "knex";
import steriItems from '../seed-data/steri_item.data'
import users from '../seed-data/user.data'
import steriCycles from '../seed-data/steri_cycle.data'
import steriLabels from '../seed-data/steri_label.data'
import chunkArray from "../seed-data/chunkArray";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("steri_label").del();
    await knex("steri_cycle").del();
    await knex("steri_item").del();
    await knex("steri").del();
    await knex("user").del();

    // Inserts seed entries
    await knex("steri").insert([
        {
            "id": 1,
            "name": "Lexa 1",
            "serial": "S/N 123432"
        }
    ])

    await knex("user").insert(users.map(({archived_at, ...user}) => ({
        ...user,
        is_active: !archived_at,
    })))
    await knex("steri_item").insert(steriItems.map(({ archived_at, ...item}) => ({
        ...item,
        is_active: !archived_at,
    })));
    const steri_cycles = chunkArray(steriCycles, 300)
    for (let i = 0; i < steri_cycles.length; i++) {
        await knex("steri_cycle").insert(steri_cycles[i]);
    }
    const steri_labels = chunkArray(steriLabels, 300)
    for (let i = 0; i < steri_labels.length; i++) {
        await knex("steri_label").insert(steri_labels[i].map(({
            appointment,
            appointment_clinic_user_id,
            ...label
        }) => ({
            ...label,
            appointment_id: appointment?.uid || null,
            appointment_user_id: appointment_clinic_user_id,
            next_label_id: 1,
        })));
    }
};
