import os

def get_file_names(directory):
    file_names = os.listdir(directory)
    return file_names

def remove_extension(file_name):
    return os.path.splitext(file_name)[0]

def save_to_file(file_names, output_file):
    with open(output_file, 'w') as file:
        for name in file_names:
            file.write(name + ',\n')

# ファイル名を取得するディレクトリのパスを指定します
directory_path = '../json'

# ファイル名のリストを取得
file_names = get_file_names(directory_path)

# 拡張子を取り除く
file_names_without_extension = [remove_extension(name) for name in file_names]

# ファイル名をファイルに保存
output_file_path = './list.txt'
save_to_file(file_names_without_extension, output_file_path)
