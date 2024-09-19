<?php

use Livewire\Attributes\Validate;
use Livewire\Volt\Component;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use App\Events\SendRealTimeMessage;
use Livewire\Attributes\On;

new class extends Component {
    use LivewireAlert;

    #[Validate('required|string|max:255')]
    public string $message = '';

    public function store(): void
    {
        $validated = $this->validate();

        $chirp = auth()->user()->chirps()->create($validated);

        $this->message = '';

        $this->dispatch('chirp-created');

        event(new SendRealTimeMessage($chirp));

        $this->alert('success', 'Mensaje Enviado');
    }

    #[On('echo:my-channel,SendRealTimeMessage')]
    public function handleSendRealTimeMessage(): void
    {
        $this->alert('success', 'Nuevo Mensaje');
    }
}; ?>

<div>
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
        <button type="submit" class="btn btn-primary mt-4">
            {{ __('Chirp') }}
        </button>
    </form>
</div>

<script>

</script>
