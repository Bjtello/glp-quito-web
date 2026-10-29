import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Repuesto {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    icono: string;
    badge?: string;
}

@Component({
    selector: 'app-repuestos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './repuestos.html',
    styleUrl: './repuestos.css'
})
export class Repuestos {

    constructor(private router: Router) { }

    categorias = ['Todos', 'Conversión', 'Mantenimiento', 'Seguridad', 'Accesorios'];
    filtroActivo = 'Todos';

    repuestos: Repuesto[] = [
        {
            id: 'kit-5gen',
            nombre: 'Kit GLP 5ta Generación',
            descripcion: 'Kit completo de inyección secuencial de gas para motores modernos. Incluye computadora, inyectores y sensores.',
            categoria: 'Conversión',
            icono: '⚙️',
            badge: 'Más vendido'
        },
        {
            id: 'reductor-presion',
            nombre: 'Reductor de Presión',
            descripcion: 'Reduce la presión del gas del cilindro a niveles operativos seguros para el motor.',
            categoria: 'Conversión',
            icono: '🔧'
        },
        {
            id: 'inyectores-glp',
            nombre: 'Inyectores GLP',
            descripcion: 'Inyectores de alta precisión para una dosificación exacta del gas. Compatible con sistemas 4ta y 5ta generación.',
            categoria: 'Conversión',
            icono: '💉'
        },
        {
            id: 'cilindro-45',
            nombre: 'Cilindro GLP 45 Lt',
            descripcion: 'Cilindro de acero certificado INEN para almacenamiento seguro de gas licuado de petróleo.',
            categoria: 'Conversión',
            icono: '🛢️',
            badge: 'Nuevo'
        },
        {
            id: 'filtro-gas',
            nombre: 'Filtro de Gas Premier',
            descripcion: 'Filtra impurezas del GLP antes de ingresar al reductor, prolongando la vida útil del sistema.',
            categoria: 'Mantenimiento',
            icono: '🌀'
        },
        {
            id: 'bujias-iridium',
            nombre: 'Bujías de Iridio',
            descripcion: 'Bujías de alto rendimiento especialmente recomendadas para vehículos convertidos a GLP.',
            categoria: 'Mantenimiento',
            icono: '⚡'
        },
        {
            id: 'valvula-seguridad',
            nombre: 'Válvula de Seguridad',
            descripcion: 'Válvula multifunción con corte automático ante fugas. Certificación CE y norma INEN.',
            categoria: 'Seguridad',
            icono: '🛡️',
            badge: 'Certificado'
        },
        {
            id: 'sensor-fugas',
            nombre: 'Sensor Detector de Fugas',
            descripcion: 'Detector electrónico de GLP que activa alarma sonora y visual ante cualquier fuga.',
            categoria: 'Seguridad',
            icono: '🔔'
        },
        {
            id: 'centralita-glp',
            nombre: 'Centralita ECU GLP',
            descripcion: 'Unidad de control electrónico que gestiona la mezcla aire-gas para un rendimiento óptimo.',
            categoria: 'Conversión',
            icono: '🖥️'
        },
        {
            id: 'manguera-alta',
            nombre: 'Manguera Alta Presión',
            descripcion: 'Manguera reforzada para conducción de GLP a alta presión desde el cilindro hasta el reductor.',
            categoria: 'Accesorios',
            icono: '🔗'
        },
        {
            id: 'switch-selector',
            nombre: 'Switch Selector Bi-combustible',
            descripcion: 'Panel de control en cabina para cambiar entre gasolina y GLP de forma manual o automática.',
            categoria: 'Accesorios',
            icono: '🎛️'
        },
        {
            id: 'aceite-motor',
            nombre: 'Aceite Motor para GLP',
            descripcion: 'Aceite sintético formulado para motores GLP. Mayor resistencia a la oxidación y desgaste.',
            categoria: 'Mantenimiento',
            icono: '🫙'
        }
    ];

    get repuestosFiltrados(): Repuesto[] {
        if (this.filtroActivo === 'Todos') return this.repuestos;
        return this.repuestos.filter(r => r.categoria === this.filtroActivo);
    }

    setFiltro(cat: string): void {
        this.filtroActivo = cat;
    }

    solicitarRepuesto(repuesto: Repuesto): void {
        this.router.navigate(['/usuarios'], { queryParams: { repuesto: repuesto.nombre } });
    }
}
