<?php

use function Livewire\Volt\{state};
use Livewire\Volt\Component;
use Livewire\Attributes\Validate;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use App\Events\SendMessage;

new class extends Component {
    use LivewireAlert;

    public $room;

    #[Validate('required|string|max:255')]
    public string $message = '';

    public function mount($room)
    {
        $this->room = $room;
    }

    public function store(): void
    {
        $validated = $this->validate();

        //$chirp = auth()->user()->chirps()->create($validated);
        auth()->user()->messages()->create([
            'message' => $this->message,
            'room_id' => $this->room->id,
        ]);

        $this->message = '';
        //$this->dispatch('chirp-created');
        //event(new SendMessage($this->room))->toOthers();
        broadcast(new SendMessage($this->room))/*->toOthers()*/;
        $this->alert('success', 'Mensaje Enviado');
    }
};

//

?>

<div class="mt-2">
    <!-- Crear un input multiline y debajo un boton -->
    <form wire:submit.prevent="store">

        <div class="form-group">
            <textarea wire:model="message" class="form-control @error('message') is-invalid @enderror"
                placeholder="{{ __('What\'s on your mind?') }}"></textarea>

            @error('message')
                <div class="invalid-feedback">
                    {{ $message }}
                </div>
            @enderror
        </div>
        <div class="d-flex justify-content-center w-100">
            <button type="submit" class="btn btn-dark mt-3">
                <i class="fas fa-paper-plane"></i> {{ __('Enviar') }}
            </button>
        </div>
    </form>
</div>